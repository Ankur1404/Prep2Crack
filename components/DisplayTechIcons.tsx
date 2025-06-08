import Image from "next/image";

import {  getTechLogos } from "@/lib/utils";

const DisplayTechIcons = async ({ techStack }: TechIconProps) => {
  const techIcons = await getTechLogos(techStack);

  return (
   <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url, doc }) => (
        <a
          key={tech}
          href={doc}
          target="_blank"

          className="relative group bg-dark-300 rounded-full p-2 flex-center"
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            {tech}
          </div>
          <Image src={url} width={100} height={100} alt={tech} className="size-4" />
        </a>
      ))}
    </div>
  );
};

export default DisplayTechIcons;