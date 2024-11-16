const paypal = require("../../helpers/paypal");
const Order = require("../../modals/Order");
const Course = require("../../modals/course");
const StudentCourses = require("../../modals/student-courses");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      paymentId,
      payerId,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/payment-return",
        cancel_url: "http://localhost:5173/cancel-payment",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: courseTitle,
                sku: courseId,
                price: coursePricing,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: coursePricing.toFixed(2),
          },
          description: courseTitle,
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log("Error creating paypal order", error);
        console.log("PayPal validation error details:", error.response.details);


        res.status(500).json({
          success: false,
          message: "Error creating paypal order",
        });
      } else {
        const newlyCreatedCourseOrder = new Order({
          userId,
          userName,
          userEmail,
          orderStatus,
          paymentMethod,
          paymentStatus,
          orderDate,
          paymentId,
          payerId,
          instructorId,
          instructorName,
          courseImage,
          courseTitle,
          courseId,
          coursePricing,
        });

        await newlyCreatedCourseOrder.save();

        const approveUrl = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        console.log("Payment order created successfully");
        console.log("approveUrl", approveUrl);

       return res.status(201).json({
          success: true,
          message: "Payment order created successfully",
          result: {
            approveUrl,
            orderId: newlyCreatedCourseOrder._id,
          },
        });
      }
    });
  } catch (error) {
    console.log("Error creating order via order conrtollers", error);
    res.status(500).json({
      success: false,
      message: "Error creating order via order conrtollers",
    });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      console.log("Order not found");
      return res.status(404).json({
        success: false,
        message: " Order not found",
      });
    }

    (order.paymentStatus = "paid"),
      (order.orderStatus = "confirmed"),
      (order.paymentId = paymentId),
      (order.payerId = payerId);

    await order.save();

    //update studnet-course modal
    const studentCourses = await StudentCourses.findOne({
      userId: order.userId,
    });

    if (studentCourses) {
      //this means the student has bought another course earlier

      studentCourses.courses.push({
        courseId: order.courseId,
        title: order.courseTitle,
        instructorId: order.instructorId,
        instructorName: order.instructorName,
        dateOfPurchase: order.orderDate,
        courseImage: order.courseImage,
      });

      await studentCourses.save();
    } else {
      //this means the student has bought his first course
      const newStudentCourses = new StudentCourses({
        userId: order.userId,
        courses: [
          {
            courseId: order.courseId,
            title: order.courseTitle,
            instructorId: order.instructorId,
            instructorName: order.instructorName,
            dateOfPurchase: order.orderDate,
            courseImage: order.courseImage,
          },
        ],
      });

      await newStudentCourses.save();
    }

    //update the course schema

    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        students: {
          studentId: order.userId,
          studentName: order.userName,
          studentEmail: order.userEmail,
          paidAmount: order.coursePricing,
        },
      },
    });

    console.log("Order confirmed");
    return res.status(200).json({
      success: true,
      message: "Order confirmed",
      order,
    });
  } catch (error) {
    console.log(("Error capturing payment via order conrtollers", error));
    res.status(500).json({
      success: false,
      message: "Error capturing payment via order conrtollers",
    });
  }
};

module.exports = { createOrder, capturePaymentAndFinalizeOrder };
