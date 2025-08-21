"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    email: z.string().trim().email("Email inválido"),
    password: z.string().trim().min(8, "A senha deve conter pelo menos 8 caracteres"),    
});

type FormSchema = z.infer<typeof formSchema>;

const SignInForm = () =>  {
    // 1. Define your form.
    const form = useForm<FormSchema>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    })

     // 2. Define a submit handler.
  function onSubmit(values: FormSchema) {
    console.log("Formulário Válido e Enviado");
    console.log(values)
  }

    return (
        <>        
        
            <Card>
            <CardHeader>
              <CardTitle>Entrar</CardTitle>
              <CardDescription>
                Faça login para continuar
              </CardDescription>
            </CardHeader>

            <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CardContent className="grid gap-6">
                    
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                    <Input placeholder="Digite seu email" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                    <Input placeholder="Digite sua senha" type="password"  {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
                </CardContent>
                <CardFooter>
                <Button type="submit">Entrar</Button>
                </CardFooter>
            </form>
            </Form>
        </Card>

        
    </>  
  )
};


 
export default SignInForm;