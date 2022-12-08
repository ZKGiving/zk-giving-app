"use client";

const Partners = () => (
  <section className="mt-[50px] lg:mt-[100px]">
      <h2 className="text-4xl text-white text-center">Our partners</h2>
    <div className="flex flex-col justify-center items-center">
      <div className="mt-12 w-full lg:w-1/2 flex flex-row items-center justify-left gap-8">
        <p className="bg-lavendar/20 flex self-start p-16 mr-8  md:m-0 rounded-3xl inline-block">
          Logo
        </p>
        <div className="flex flex-col">
          <h3 className="text-white text-3xl">Aztec</h3>
          <p className="text-white text-base-xl">
            Magna etiam tempor orci eu lobortis elementum nibh tellus molestie.
            Diam maecenas sed enim ut sem viverra.
          </p>
        </div>
      </div>
      <div className="mt-8 w-full lg:w-1/2 flex flex-row items-center justify-left gap-8">
        <p className="bg-lavendar/20 flex self-start p-16 mr-8  md:m-0 rounded-3xl inline-block">
          Logo
        </p>
        <div className="flex flex-row flex-col">
          <h3 className="text-white text-3xl">Endaoment</h3>
          <p className="text-white text-base-xl">
            Magna etiam tempor orci eu lobortis elementum nibh tellus molestie.
            Diam maecenas sed enim ut sem viverra.
          </p>
        </div>
      </div>
    </div>
    <div className="mt-[50px] lg:mt-[100px] border-b-2 border-bg-lavendar" />
  </section>
);

export default Partners;
