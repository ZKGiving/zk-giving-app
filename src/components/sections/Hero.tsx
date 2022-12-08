"use client";

import Placeholder from "../../assets/hero-placeholder-img.png";

const Hero = () => (
  <section className="sm:pt-[25px] lg:pt-[50px]">
    <div className="flex flex-col lg:flex-row items-center gap-10">
      <div className="w-full">
        <h1 className="text-xl lg:text-5xl font-bold text-dark-purple">
          Your donations, always protected.
        </h1>
        <p className="mt-[27px] text-base lg:text-base-xl text-royal-purple">
          Lorem ipsum dolor sit amet consectetur. Massa tempor nisi sodales ut
          adipiscing dignissim aliquam nec id. Nascetur at massa fames cursus.
        </p>
        <div className="mt-[27px] flex flex-col md:flex-row justify-between">
          <button className="w-full md:mr-[20px] bg-bright-purple text-base xl:text-[1.125rem] font-bold hover:bg-bright-purple/75 text-white rounded-full md:mt-0 px-18 py-2">
            Learn more
          </button>
          <button className="w-full bg-white border-2 border-bright-purple text-base xl:text-[1.125rem] font-bold hover:border-bright-purple/75 hover:text-bright-purple/75 text-bright-purple rounded-full mt-4 md:mt-0 px-18 py-2">
            Donate now
          </button>
        </div>
      </div>
      <div className="w-[60%] lg:w-3/4 order-first lg:order-last">
        <img
          src={Placeholder}
          alt="Placeholder image"
          className="mx-[auto]"
        />
      </div>
    </div>
    <div className="mt-[50px] lg:mt-[100px] border-b-2 border-bg-lavendar" />
  </section>
);

export default Hero;
