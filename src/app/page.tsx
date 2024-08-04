import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className=" flex justify-center flex-col items-center pb-20">
      <section className="h-[30vh] max-h-[] flex flex-col justify-center items-center ">
        <span className="text-4xl font-bold text-center">Empowering Businesses with Intelligent Scheduling.</span>
        <span>...for free!</span>
      </section>

      <section className="h-20">
        <Link href='/auth'>
          <Button className="bg-white text-black hover:bg-slate-300 hover:text-black">Use RosterPro</Button>
        </Link>
      </section>

      <video className="w-[90%] shadow-2xl shadow-slate-500 hover:cursor-pointer" loop autoPlay muted preload="none">
        <source src='/showcase.mp4' type="video/mp4" />
      </video>
      
      <section className="mt-10 flex flex-col">
        <span className="text-7xl font-cursive text-center">Tools</span>
        
        {/* TODO Style this card properly */}
        <div className="flex justify-center">
          <Card className="p-5 basis-[250px] flex flex-col items-center">
            <CardTitle className="">
              <span className="font-medium">Person-Job Assigner</span>
            </CardTitle>

            <CardContent>
              <span className="">
                Dyanmically create schedules in which people's names map to assigned jobs.
              </span>
            </CardContent>
          </Card>
        </div>
      </section>
      
    </main>
  );
}
