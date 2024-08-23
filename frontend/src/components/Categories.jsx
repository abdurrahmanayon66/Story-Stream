import React from "react";
import images from "../assets/images";
import {useNavigate} from 'react-router-dom'
const Categories = () => {

  const navigate = useNavigate();

  const handleCardClick = (genre) => {
    navigate(`/blogs/${genre}`);
  };
  
  return (
    <div className="px-16 pt-10 pb-20">
      <div className="flex">
        <section className="w-[40%] flex items-start">
          <p className="text-6xl text-darkPurple text-bold">
            Discover Knowledge and Inspiration with StoryStream's Categories
          </p>
        </section>
        <section className="w-[60%] flex flex-wrap gap-10">
          <div className="relative h-[500px] w-[350px] hover:cursor-pointer" onClick={() => handleCardClick('Education')}>
            <img
              className="w-full h-full object-cover rounded-md"
              src={images.education}
              alt="Education"
            />
            <div className="absolute inset-0 bg-black opacity-30 rounded-md"></div>
            <div className="absolute inset-0 flex justify-center items-center">
              <p className="text-5xl text-white font-bold">Education</p>
            </div>
          </div>

          <div className="relative h-[400px] w-[350px] hover:cursor-pointer" onClick={() => handleCardClick('Environment')}>
            <img
              className="w-full h-full object-cover rounded-md"
              src={images.environment}
              alt="Environment"
            />
            <div className="absolute inset-0 bg-black opacity-30 rounded-md"></div>
            <div className="absolute inset-0 flex justify-center items-center">
              <p className="text-5xl text-white font-bold">Environment</p>
            </div>
          </div>

          <div className="relative h-[400px] w-[350px] hover:cursor-pointer" onClick={() => handleCardClick('Business')}>
            <img
              className="w-full h-full object-cover rounded-md"
              src={images.business}
              alt="Business"
            />
            <div className="absolute inset-0 bg-black opacity-30 rounded-md"></div>
            <div className="absolute inset-0 flex justify-center items-center">
              <p className="text-5xl text-white font-bold">Business</p>
            </div>
          </div>

          <div className="relative w-[350px] h-[500px] hover:cursor-pointer">
            <img
              className="h-full w-full"
              src={images.lifestyle}
              alt="Lifestyle"
            />
            <div className="absolute inset-0 bg-black opacity-30 rounded-md"></div>
            <div className="absolute inset-0 flex justify-center items-center">
              <p className="text-5xl text-white font-bold">Lifestyle</p>
            </div>
          </div>

          <div className="relative h-[500px] w-[350px] hover:cursor-pointer">
            <img
              className="w-full h-full object-cover rounded-md"
              src={images.medicalScience}
              alt="Medical Science"
            />
            <div className="absolute inset-0 bg-black opacity-30 rounded-md"></div>
            <div className="absolute inset-0 flex justify-center items-center">
              <p className="text-5xl text-white font-bold text-center">Medical Science</p>
            </div>
          </div>

          <div className="relative h-[500px] w-[350px] hover:cursor-pointer">
            <img
              className="w-full h-full object-cover rounded-md"
              src={images.leadership}
              alt="Leadership"
            />
            <div className="absolute inset-0 bg-black opacity-30 rounded-md"></div>
            <div className="absolute inset-0 flex justify-center items-center">
              <p className="text-5xl text-white font-bold">Leadership</p>
            </div>
          </div>

          <div className="relative h-[400px] w-[350px] hover:cursor-pointer">
            <img
              className="w-full h-full object-cover rounded-md"
              src={images.technology}
              alt="Technology"
            />
            <div className="absolute inset-0 bg-black opacity-30 rounded-md"></div>
            <div className="absolute inset-0 flex justify-center items-center">
              <p className="text-5xl text-white font-bold">Technology</p>
            </div>
          </div>

          <div className="relative h-[500px] w-[350px] hover:cursor-pointer">
            <img
              className="w-full h-full object-cover rounded-md"
              src={images.fashion}
              alt="Fashion"
            />
            <div className="absolute inset-0 bg-black opacity-30 rounded-md"></div>
            <div className="absolute inset-0 flex justify-center items-center">
              <p className="text-5xl text-white font-bold">Fashion</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Categories;
