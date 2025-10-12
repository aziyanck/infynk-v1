// Services.jsx
import React from "react";

const Services = () => {
  const services = [
    {
      text1: (
        <>
          Share Your Info! <br /> With just a{" "}
          <span className="text-blue-500">Tap</span>
        </>
      ),
      text2: (
        <>
          Personalized <span className="text-blue-500">Design</span> <br /> with
          Your Brand Identity
        </>
      ),
    },
    {
      text1: (
        <>
          Update Your Profile <br />
          <span className="text-blue-500">Anytime</span>, Without Reprinting
        </>
      ),
      text2: (
        <>
          <span className="text-blue-500">Analyze and Track</span> How Many{" "}
          <br /> People Tapped Your Card
        </>
      ),
    },
  ];

  return (
    <section className="bg-black text-white py-10 px-6 md:px-20 w-screen flex flex-col poppins-extrabold">
      <div className="h-[40vh] md:h-[50vh] w-full md:w-[50vw] flex self-start items-center">
        <p className="text-xl md:text-5xl">{services[0].text1}</p>
      </div>

      <div className="h-[40vh] md:h-[50vh] w-full md:w-[50vw] flex self-end justify-end items-center text-right">
        <p className="text-xl md:text-5xl">{services[0].text2}</p>
      </div>

      <div className="h-[40vh] md:h-[50vh] w-full md:w-[50vw] flex self-start items-center">
        <p className="text-xl md:text-5xl">{services[1].text1}</p>
      </div>

      <div className="h-[40vh] md:h-[50vh] w-full md:w-[50vw] flex self-end justify-end items-center text-right">
        <p className="text-xl md:text-5xl">{services[1].text2}</p>
      </div>
    </section>
  );
};

export default Services;
