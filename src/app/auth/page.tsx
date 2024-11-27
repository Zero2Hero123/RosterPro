'use client'
import { Suspense, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logIn, signUp } from "@/utils/actions";
import { useRouter, useSearchParams } from "next/navigation";

const initState = {
    message: ''
}

const Auth: React.FC<{}> = () => {

    const search = useSearchParams()

    const authMethod = search.get('m')

    const [state,signUpAction] = useActionState(signUp,initState)

    const [logInState,logInAction] = useActionState(logIn,initState)

    const router = useRouter()

    if(state.message == 'Success!'){
        router.back()
    }

    return (<>
        
        
        <main className=" flex justify-center items-center h-[88vh]">
            <div className="bg-black w-[35%] min-w-[360px] rounded-lg aspect-square">
                <div className="flex justify-center text-2xl items-center my-4">
                    <span>Join RosterPro</span>
                </div>
                <div className="">
                    <div className=" text-red-500 text-center h-4">{state.message as string}</div>
                    <div className=" text-red-500 text-center h-4">{logInState.message as string}</div>
                    <Tabs defaultValue={authMethod || 'sign-up'}>
                        <TabsList className="bg-black flex justify-center my-2" >
                            <TabsTrigger value={"sign-up"}>Sign Up</TabsTrigger>
                            <TabsTrigger value={"log-in"}>Log In</TabsTrigger>
                        </TabsList>

                        <TabsContent value="sign-up" className="">

                            {/* SIGN UP FORM */}
                            <form className="flex flex-col justify-between gap-3" action={signUpAction}>
                                <div className="px-4 flex flex-col gap-2 items-center">
                                    <div className="flex flex-col gap-2 basis-[80%]">
                                        <Input required name="email" type="email" className="bg-black" placeholder="Email"/>
                                        <Input name="business_name" type="text" className="bg-black" placeholder="Organization Name (Optional)"/>
                                        <div className="flex gap-2">
                                            <Input required name="fname" className="bg-black" placeholder="First Name"/>
                                            <Input required name='lname' className="bg-black" placeholder="Last Name"/>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input minLength={8} required name='password' placeholder="Password" className="bg-black" type="password"/>
                                        <Input minLength={8} required name='conf-password' placeholder="Confirm Password" className="bg-black" type="password"/>
                                    </div>
                                    <Button type="submit" className="bg-white w-[60%] text-black mx-4 hover:bg-slate-200"  >Sign Up</Button>
                                </div>
                                
                            </form>
                            
                        </TabsContent>

                        <TabsContent value="log-in">

                            {/* LOG IN FORM */}

                            <form className="flex flex-col justify-between gap-3" action={logInAction}>
                                <div className="px-4 flex flex-col gap-2 items-center">
                                    <Input required className="bg-black w-[70%]" name="email" type="email" placeholder="Email" />
                                    <Input required className="bg-black w-[70%]" name="password" type="password" placeholder="Password" />
                                    <Button type="submit" className="bg-white text-black mx-4 hover:bg-slate-200 w-[60%]"  >Log in</Button>
                                </div>
                                
                            </form>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </main>
    
    
    </>)
}


export default Auth;