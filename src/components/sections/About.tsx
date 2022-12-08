"use client";

import PlaceholderAnimation from "../../assets/logo-animation-placeholder.png";

const About = () => (
  <section className="mt-[50px] lg:mt-[100px]">
    <div className="flex flex-row items-center justify-between gap-8 w-full">
      <div className="lg:w-2/5">
        <div className="w-full">
          <h2 className="font-bold text-4xl text-dark-purple">
            A mission and values you get get behind.
          </h2>
        </div>
        <div className="flex flex-row items-center w-full mt-6">
          <p className="bg-lavendar/20 px-8 py-6 mr-8 text-white rounded-3xl inline-block">
            1
          </p>
          <div>
            <p className="text-base lg:text-base-xl text-white">
              Lorem ipsum dolor sit amet consectetur. Quis fusce viverra
              porttitor gravida elementum.
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center w-full mt-6">
          <p className="bg-lavendar/20 px-8 py-6 mr-8 text-white rounded-3xl inline-block">
            2
          </p>
          <div>
            <p className="text-base lg:text-base-xl text-white">
              Lorem ipsum dolor sit amet consectetur. Quis fusce viverra
              porttitor gravida elementum.
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center w-full mt-6">
          <p className="bg-lavendar/20 px-8 py-6 mr-8 text-white rounded-3xl inline-block">
            3
          </p>
          <div>
            <p className="text-base lg:text-base-xl text-white">
              Lorem ipsum dolor sit amet consectetur. Quis fusce viverra
              porttitor gravida elementum.
            </p>
          </div>
        </div>
      </div>
      <img
        src={PlaceholderAnimation}
        alt="Placeholder image"
        className="mx-[auto] w-2/5 hidden md:inline-block"
      />
    </div>
    <div className="mt-[50px] lg:mt-[100px] border-b-2 border-bg-lavendar" />
  </section>
);

export default About;
