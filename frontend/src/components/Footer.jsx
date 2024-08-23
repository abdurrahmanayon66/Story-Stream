import React from 'react'
import { GoMail } from "react-icons/go";
import footer from './footer.png'

const Footer = () => {
  return (
    <div>
        <footer className="grid grid-rows-2 py-6 gap-y-[300px] px-16 bg-lightPink h-[700px]">
              <section className='w-full flex justify-between'>
                  <div className='w-1/2 space-y-4 h-[400px] flex flex-col justify-center'>
                      <p className='text-3xl text-darkPurple font-semibold'>Stay Updated, Stay Connected!</p>
                      <label className="input input-bordered flex items-center justify-between w-[80%] bg-white shadow-xl px-2">
                          <div className='flex items-center'>
                          <GoMail className='text-xl font-semibold mr-3' />
                          <input type="text" className="grow max-w-[60%] font-semibold text-black placeholder:text-slate-500 placeholder:font-semibold" placeholder="Your Email" />
                          </div>
                          <button className='bg-purple-400 w-[30%] rounded-md font-semibold h-10 text-white'>Get Started</button>
                      </label>
                      <p className='w-[80%] text-darkPurple text-md'>Subscribe to our newsletter for the latest updates, exclusive content, and special offers. Don't miss out - join our community today!</p>
                  </div>

                  <div className='w-1/2 h-[400px] flex justify-center'>
                        <img className='max-h-full' src={footer} alt="" />
                  </div>
              </section>

              <section className='w-full'>
                 <footer className="footer w-full bg-lightPink text-base-content">
                      <aside>
                        <p className='text-6xl font-semibold text-darkPurple'>StoryStream</p>
                        <p className='mt-4 text-darkPurple'><span className='text-lg font-semibold'>StoryStream Inc.</span><br/><span className='italic text-md font-semibold'>A community of passionate writers and readers since 2024</span></p>
                        <p className='italic text-md font-semibold text-darkPurple'>Designed and Developed by <span>Abdur Rahman Ayon</span></p>
                      </aside> 
                      <nav className='text-darkPurple text-lg'>
                        <h6 className="footer-title">Company</h6> 
                        <a className="link link-hover">Home</a>
                        <a className="link link-hover">Blogs</a>
                        <a className="link link-hover">Categories</a>
                      </nav> 
                      <nav className='text-darkPurple text-lg'>
                        <h6 className="footer-title">Legal</h6> 
                        <a className="link link-hover">Terms of use</a>
                        <a className="link link-hover">Privacy policy</a>
                        <a className="link link-hover">Cookie policy</a>
                      </nav>
                  </footer>
              </section>
              
        </footer>
  </div>
  )
}

export default Footer