import React from "react";

const Loader = () => (
  <div className="flex items-center justify-center min-h-[200px] w-full">
    <span className="inline-block w-12 h-12 border-4 border-t-transparent border-gray-300 rounded-full animate-spin" aria-label="Loading" />
  </div>
);

export default Loader; 