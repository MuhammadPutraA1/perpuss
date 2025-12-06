"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Accor } from "@/components/form/accor"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      <nav className="flex justify-between items-center px-12 py-6">
        
        <div className="flex items-center space-x-2">
          <Image src="/assets/Group 76.png" alt="Logo" width={120} height={32}/>
        </div>

        <div className="flex items-center space-x-10 text-gray-600 font-medium">
          <a href="#" className="hover:text-teal-500 transition">Home</a>
          <a href="#" className="hover:text-teal-500 transition">Category</a>
          <a href="#" className="hover:text-teal-500 transition">Authors</a>


          <Link href={"/login"}>
          <Button variant={"destructive"} >Login</Button>
          </Link>
        </div>

      </nav>

     
      <section className="flex flex-col md:flex-row items-center justify-between flex-1 px-12 md:px-24 mt-10">
        
        <div className="max-w-xl space-y-6">
          <h1 className="text-6xl font-bold text-gray-900 leading-tight">The <span className="text-teal-600">KaguLib</span><br/>Kaguya Library.</h1>

          <p className="text-gray-500 text-lg max-w-md">Booking from the largest collection of books.Read stories from it.</p>
            <Link href={"/login"}>
            <Button>Get Started</Button>
            </Link>
        </div> 

        <div className="mt-10 md:mt-0">
          <Image src="/assets/bglanding.jpg" alt="" width={460} height={460} className="select-none"/>
        </div>
        
      </section>
      <br />
      <br />
      <br />
       <br />
       <br />
       <section className="flex flex-col md:flex-row  flex-1 px-12 md:px-24 mt-10">

        <div className="mt-10 md:mt-0">
          <Image src="/assets/bgcwk.jpg" alt="" width={460} height={460} className="select-none"/>
        </div>

          <div className="max-w-xl space-y-6">
            <h1 className="mt-10 font-bold text-xl">
              KaguLib
            </h1>

            <p className="text-gray-500 text-lg max-w-md">
            A library is more than just a place to borrow books—it is a vibrant learning space where knowledge, creativity, and curiosity come together. It provides access to a wide collection of books, digital resources, journals, and multimedia materials that support students, teachers, and the entire community. </p>
            
            <Button>See All </Button>
          </div>

       </section>
    
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1 className="font-bold flex text-teal-600 text-4xl justify-center">FAQ</h1>
      <Accor></Accor>
     <footer className="mt-20 w-full bg-teal-600 text-white">
  <div className=" md:px-10 py-10 flex flex-col md:flex-row justify-between">

    
    <div className="space-y-3 max-w-sm">
      <h2 className="text-2xl font-bold">KaguLib</h2>
      <p className="text-gray-100 text-sm">
        Your trusted digital library for exploring knowledge, stories, and inspiration.
      </p>
    </div>

   
    <div className="mt-8 md:mt-0">
      <h3 className="text-lg font-semibold mb-2">Contact</h3>

      <ul className="space-y-1 text-gray-100">
        <li>Email: support@kagulib.com</li>
        <li>Phone: +62 812-3456-7890</li>
        <li>Address: Jl. Kaguya No. 21, Indonesia</li>
      </ul>
    </div>

  </div>

  <div className="border-t border-teal-500 text-center py-4 text-gray-100 text-sm">
    © 2025 KaguLib. All rights reserved.
  </div>
</footer>
    
    </div>

    
  )
}
