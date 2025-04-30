import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import axios from "axios";
import TableProduct from "./TableProduct";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, userAddress, url, user, clearCart } = useContext(AppContext);
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let qty = 0;
    let price = 0;
    if (cart?.items) {
      for (let i = 0; i < cart.items?.length; i++) {
        qty += cart.items[i].qty;
        price += cart.items[i].price;
      }
    }
    setPrice(price);
    setQty(qty);
  }, [cart]);

  const handlePayment = async () => {
    try {
      const orderRepons = await axios.post(`${url}/payment/checkout`, {
        amount: price,
        qty: qty,
        cartItems: cart?.items,
        userShipping: userAddress,
        userId: user._id,
      });

      console.log(" order response ", orderRepons);
      const { orderId, amount: orderAmount } = orderRepons.data;

      var options = {
        // key: "rzp_test_gHH711O4gcSjCq", // Enter the Key ID generated from the Dashboard
        key: "rzp_test_wv2WIo4cgxzHw3", // Enter the Key ID generated from the Dashboard
        amount: orderAmount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "अपनाMart",
        description: "Hi",

        order_id: orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (response) {
          const paymentData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: orderAmount,
            orderItems: cart?.items,
            userId: user._id,
            userShipping: userAddress,
          };

          const api = await axios.post(
            `${url}/payment/verify-payment`,
            paymentData
          );

          console.log("razorpay res ", api.data);

          if (api.data.success) {
            clearCart();
            navigate("/oderconfirmation");
          }
        },
        prefill: {
          name: "Rahul Raj",
          email: "rajrahul18122003@gmail.com",
          contact: "8789046362",
        },
        notes: {
          address: "BhagalPur , Bihar",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(`${error}url not working...`);
    }
  };

  return (
    <>
<div className="container  my-3">
  <h1 className="text-center">Order Summary</h1>

  <table className="table table-bordered border-primary bg-dark">
    <thead className="bg-dark">
      <tr>
        <th scope="col" className="bg-dark text-light text-center">
          Product Details
        </th>

        <th scope="col" className="bg-dark text-light text-center">
          Shipping Address
        </th>
      </tr>
    </thead>
    <tbody className="bg-dark">
      <tr>
        <td className="bg-dark text-light">
          <TableProduct cart={cart} />
        </td>
        <td className="bg-dark text-light">
          <ul style={{ fontWeight: "bold" }}>
            <li>Name : {userAddress?.fullName}</li>
            <li>Phone : {userAddress?.phoneNumber}</li>
            <li>Country : {userAddress?.country}</li>
            <li>State : {userAddress?.state}</li>
            <li>PinCode : {userAddress?.pincode}</li>
            <li>Near By : {userAddress?.address}</li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</div>

      <div className="container text-center my-5">
        <button
          className="btn btn-secondary btn-lg"
          style={{ fontWeight: "bold" }}
          onClick={handlePayment}
        >
          Procced To Pay
        </button>
      </div>
    </>
  );
};

export default Checkout;

////////////////////////////////////

// import React from 'react'

// import React, { useContext, useEffect, useState } from "react";
// import AppContext from "../context/AppContext";
// import { useNavigate } from "react-router-dom";

// const Checkout = () => {
//   const { cart, decreaseQty, addToCart, removeFromCart, clearCart } =
//     useContext(AppContext);
//   const [qty, setQty] = useState(0);
//   const [price, setPrice] = useState(0);

//   const navigate = useNavigate();

//   useEffect(() => {
//     let qty = 0;
//     let price = 0;
//     if (cart?.items) {
//       for (let i = 0; i < cart.items?.length; i++) {
//         qty += cart.items[i].qty;
//         price += cart.items[i].price;
//       }
//     }
//     setPrice(price);
//     setQty(qty);
//   }, [cart]);

//   // console.log("my cart", cart);
//   return (
//     <>
//       <div className="container  my-3">
//         <h1 className="text-center">Order Summary</h1>

//         <table className="table table-bordered border-primary bg-dark">
//           <thead className="bg-dark">
//             <tr>
//               <th scope="col" className="bg-dark text-light text-center">
//                 Product Details
//               </th>

//               <th scope="col" className="bg-dark text-light text-center">
//                 Shipping Address
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-dark">
//             <tr>
//               <td className="bg-dark text-light">
//                 {/* <TableProduct cart={cart} /> */}
//               </td>
//               <td className="bg-dark text-light">
//                 <ul style={{ fontWeight: "bold" }}>
//                   <li>Name : {userAddress?.fullName}</li>
//                   <li>Phone : {userAddress?.phoneNumber}</li>
//                   <li>Country : {userAddress?.country}</li>
//                   <li>State : {userAddress?.state}</li>
//                   <li>PinCode : {userAddress?.pincode}</li>
//                   <li>Near By : {userAddress?.address}</li>
//                 </ul>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       {cart?.items?.map((product) => (
//         <div
//           key={product._id}
//           className="container p-3 bg-dark my-5 text-center  "
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-around",
//               alignItems: "center",
//               backgroundColor: "pink",
//             }}
//           >
//             <div className="cart_img">
//               <img
//                 src={product.imgSrc}
//                 alt=""
//                 style={{
//                   width: "100px",
//                   height: "100px",
//                   borderRadius: "10px",
//                 }}
//               />
//             </div>
//             <div className="cart_des">
//               <h2>{product.title}</h2>
//               <h4>{product.price}</h4>
//               <h4>Qty :- {product.qty}</h4>
//             </div>
//             <div className="cart_action">
//               <button
//                 className="btn btn-warning mx-3"
//                 style={{ fontWeight: "bold" }}
//                 onClick={() => decreaseQty(product?.productId, 1)}
//               >
//                 Qty--
//               </button>
//               <button
//                 className="btn btn-info mx-3"
//                 style={{ fontWeight: "bold" }}
//                 onClick={() =>
//                   addToCart(
//                     product?.productId,
//                     product.title,
//                     product.price / product.qty,
//                     1,
//                     product.imgSrc
//                   )
//                 }
//               >
//                 Qty++
//               </button>
//               <button
//                 className="btn btn-danger mx-3"
//                 style={{ fontWeight: "bold" }}
//                 onClick={() => {
//                   if (confirm("Are you sure, want remove from cart")) {
//                     removeFromCart(product?.productId);
//                   }
//                 }}
//               >
//                 Remove{" "}
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </>
//   );
// };

// export default Checkout;

///////////////////////////////////////////

// import React, { useContext, useEffect, useState } from "react";
// import AppContext from "../context/AppContext";
// import axios from "axios";
// import TableProduct from "./TableProduct";
// import { useNavigate } from "react-router-dom";

// const Checkout = () => {
//   const { cart, userAddress, url, user, clearCart } = useContext(AppContext);
//   const [qty, setQty] = useState(0);
//   const [price, setPrice] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (cart?.items) {
//       const qty = cart.items.reduce((acc, item) => acc + item.qty, 0);
//       const price = cart.items.reduce((acc, item) => acc + item.price, 0);
//       setPrice(price);
//       setQty(qty);
//     }
//   }, [cart]);

//   const handlePayment = async () => {
//     if (!window.Razorpay) {
//       console.error("Razorpay script is not loaded.");
//       return;
//     }

//     try {
//       const orderResponse = await axios.post(`${url}/payment/checkout`, {
//         amount: price,
//         qty,
//         cartItems: cart?.items,
//         userShipping: userAddress,
//         userId: user._id,
//       });

//       console.log("Order response:", orderResponse);
//       const { orderId, amount: orderAmount } = orderResponse.data;

//       const options = {
//         key: "rzp_test_gHH711O4gcSjCq",
//         amount: orderAmount * 100,
//         currency: "INR",
//         name: "अपनाMart",
//         description: "Order Payment",
//         order_id: orderId,
//         handler: async function (response) {
//           try {
//             const paymentData = {
//               orderId: response.razorpay_order_id,
//               paymentId: response.razorpay_payment_id,
//               signature: response.razorpay_signature,
//               amount: orderAmount,
//               orderItems: cart?.items,
//               userId: user._id,
//               userShipping: userAddress,
//             };

//             const api = await axios.post(
//               `${url}/payment/verify-payment`,
//               paymentData
//             );

//             console.log("Payment verification response:", api.data);
//             if (api.data.success) {
//               clearCart();
//               navigate("/orderconfirmation");
//             }
//           } catch (err) {
//             console.error("Payment verification failed:", err);
//             alert("Payment verification failed. Please try again.");
//           }
//         },
//         prefill: {
//           name: user?.name || "Rahul Raj",
//           email: user?.email || "rajrahul18122003@gmail.com",
//           contact: user?.phone || "8789046362",
//         },
//         notes: {
//           address: userAddress?.address || "Bhagalpur, Bihar",
//         },
//         theme: {
//           color: "#3399cc",
//         },
//       };
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       console.error("Error during payment:", error);
//       alert("Payment failed. Please try again.");
//     }
//   };

//   return (
//     <>
//       <div className="container my-3">
//         <h1 className="text-center">Order Summary</h1>
//         <table className="table table-bordered border-primary bg-dark">
//           <thead className="bg-dark">
//             <tr>
//               <th className="bg-dark text-light text-center">
//                 Product Details
//               </th>
//               <th className="bg-dark text-light text-center">
//                 Shipping Address
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-dark">
//             <tr>
//               <td className="bg-dark text-light">
//                 <TableProduct cart={cart} />
//               </td>
//               <td className="bg-dark text-light">
//                 <ul style={{ fontWeight: "bold" }}>
//                   <li>Name: {userAddress?.fullName}</li>
//                   <li>Phone: {userAddress?.phoneNumber}</li>
//                   <li>Country: {userAddress?.country}</li>
//                   <li>State: {userAddress?.state}</li>
//                   <li>PinCode: {userAddress?.pincode}</li>
//                   <li>Nearby: {userAddress?.address}</li>
//                 </ul>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <div className="container text-center my-5">
//         <button
//           className="btn btn-secondary btn-lg"
//           style={{ fontWeight: "bold" }}
//           onClick={handlePayment}
//         >
//           Proceed to Pay
//         </button>
//       </div>
//     </>
//   );
// };

// export default Checkout;

///////////////////////////////////////////////////
