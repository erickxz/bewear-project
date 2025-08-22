import { Header } from "@/components/common/header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import SignInForm from "./components/sign-in-form"
import SignUpForm from "./components/sign-up-form"

const AuthenticationPage = async () => {
  return (
    <>
 <div className="flex flex-col min-h-screen">
  <Header />
  <main className="flex flex-1 items-center justify-center w-full">
    <div className="w-[400px] flex flex-col items-center">
      <div className="transform scale-125 w-full">
        <Tabs defaultValue="sign-in" className="w-full">
          <TabsList className="grid grid-cols-2 gap-4 mb-6 w-full">
            <TabsTrigger value="sign-in">Entrar</TabsTrigger>
            <TabsTrigger value="sign-up">Criar Conta</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <SignInForm />
          </TabsContent>
          <TabsContent value="sign-up">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </main>
</div>





    
    </>
  )
};
export default AuthenticationPage;