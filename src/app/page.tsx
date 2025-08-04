"use client";

import FBVideoShow from "@/components/shared/fb-video-show";
import { getAllInfo } from "@/server/action";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { socialsUrl } from "./constants";
import { cn } from "@/lib/utils";

export default function PortfolioPage() {
  const { isPending, data, error } = useQuery({
    queryKey: ["home_data"],
    queryFn: () => getAllInfo(),
  });
  if (error) {
    return <div className="text-red-500">Error </div>;
  }

  return (
    <main
      id="main-background"
      className=" min-h-dvh  w-full  text-white font-sans"
    >
      {isPending ? (
        <div className="flex items-center justify-center h-20">
          <Loader2Icon className="animate-spin" />
        </div>
      ) : !data.info ? (
        <div className="text-center pt-10">No Data !</div>
      ) : (
        <div>
          {" "}
          {/* Navigation */}
          <nav className="fixed top-0 bg-stone-900/20 border-b border-black backdrop-blur-sm left-0 w-full  shadow-md z-50 p-4 flex justify-center space-x-6 md:space-x-8">
            {["About", "Services", "Projects", "Contact"].map((section) => (
              <Link
                key={section}
                href={`#${section.toLowerCase()}`}
                className=" text-xs md:text-base  text-stone-600 font-black  hover:text-blue-600 transition-colors"
              >
                {section.toUpperCase()}
              </Link>
            ))}
          </nav>
          {/* Hero / About */}
          <section
            id="about"
            className="pt-28 pb-16 flex flex-col items-center text-center px-4"
          >
            <div className="animate-in fade-in slide-in-from-top-10 duration-1000">
              <Image
                src={data.info.profileUrl || "/dummy-img-2.png"}
                height={200}
                width={200}
                alt="Profile"
                className="w-40 h-40 rounded-full shadow-md border-4 border-white mb-4"
              />
            </div>
            <h1 className="text-3xl font-bold animate-in fade-in slide-in-from-left-10 duration-1000">
              {data.info.name}
            </h1>
            <p className="text-blue-600 font-semibold text-lg animate-in fade-in slide-in-from-right-10 duration-1000">
              {data.info.qualification}
            </p>
            <p className="max-w-xl mt-4 text-gray-600 text-sm md:text-base animate-in fade-in slide-in-from-bottom-5 duration-[2s]">
              {data.info.qualify_des}
            </p>
          </section>
          {/* Services */}
          <section
            id="services"
            className="py-16  px-4 text-center max-w-7xl m-auto"
          >
            <h2 className="text-2xl font-bold text-gray-700 mb-8">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto ">
              {data.info.services.map((service, i) => (
                <div
                  key={i}
                  className=" bg-radial-[at_right_top,#3e3e3e,black] p-6 rounded-2xl shadow hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-blue-500 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-500">{service.des}</p>
                </div>
              ))}
            </div>
          </section>
          {/* Projects */}
          <section
            id="projects"
            className="py-16  px-4 text-center max-w-7xl m-auto"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Projects</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 ">
              {data.info.projects.map((url, idx) => (
                <FBVideoShow myVideoUrl={url.url} key={idx} />
              ))}
            </div>
          </section>
          {/* Contact */}
          <section id="contact" className="py-28 px-4  text-center">
            <h2 className="text-2xl font-bold text-gray-600 mb-8">Contact</h2>
            <div className="flex justify-center space-x-6">
              {data.info.contactIcons.map((info, i) => (
                <div key={i}>
                  {socialsUrl
                    .filter((item) => item.name === info.icon)
                    .map((icon, i) => (
                      <Link key={i} href={info.link} target="_blank">
                        <span>
                          {
                            <icon.icon
                              className={cn("text-2xl", icon.tailwind)}
                            />
                          }
                        </span>
                      </Link>
                    ))}
                </div>
              ))}
            </div>
          </section>
          {/* Footer */}
          <footer className="text-center text-sm py-6  text-gray-500">
            © {new Date().getFullYear()} John Doe. All rights reserved.
          </footer>
        </div>
      )}
    </main>
  );
}
