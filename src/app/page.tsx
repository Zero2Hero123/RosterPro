import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className=" flex justify-center flex-col items-center">
      <span>RosterPro</span>
      <span>Employee Scheduling made easy.</span>
      <Link href='/dashboard/scheduler'>Click here</Link>
    </main>
  );
}
