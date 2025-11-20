import React from "react";

export default function Container({ children }) {
  return (
    <>
      <div className=" w-full max-w-7xl mx-auto mt-8 mb-8 md:mt-10 md:mb-10 p-6 md:p-8 lg:p-10">
        {children}
      </div>
    </>
  );
}
