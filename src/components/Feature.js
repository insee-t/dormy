import Image from "next/image";
import React from "react";
import ScrollAnimationWrapper from "./Layout/ScrollAnimationWrapper";

const features = [
  "Powerfull online protection.",
  "Internet without borders.",
  "Supercharged VPN",
  "No specific time limits."
]

const Feature = () => {
  return (
    <div
      className="max-w-screen-xl mt-8 mb-6 sm:mt-14 sm:mb-14 px-6 sm:px-8 lg:px-16 mx-auto"
      id="feature"
    >
      <div className="grid grid-flow-row sm:grid-flow-col grid-cols-1 sm:grid-cols-2 gap-8 p  y-8 my-12">
        <ScrollAnimationWrapper className="flex w-full justify-end">
          <div className="h-full w-full p-4 animate-fade-in">
            <Image
              src="/assets/Illustration2.png"
              alt="VPN Illustrasi"
              layout="responsive"
              quality={100}
              height={414}
              width={508}
            />
          </div>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>

        <div className="flex flex-col items-end justify-center ml-auto w-full lg:w-9/12 animate-fade-in">
          <h3 className="text-3xl lg:text-4xl font-medium leading-relaxed text-#0B132A">
            We Provide Many Features You Can Use
          </h3>
          <p className="my-2 text-#4F5665">
            You can explore the features that we provide with fun and have their
            own functions each feature.
          </p>
          <ul className="text-#4F5665 self-start list-inside ml-8">
            {features.map((feature, index) => (
              <li
                className="relative circle-check custom-list hover:scale-110 transition-transform duration-200"
                key={feature}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                  {feature}
              </li>
              )
            )}
          </ul>
        </div>
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
};

export default Feature;
