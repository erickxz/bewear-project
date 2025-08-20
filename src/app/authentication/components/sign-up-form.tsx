"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    name: z.string().min(1, "O nome não pode ser vazio"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "A senha deve conter pelo menos 8 caracteres"),
    confirmPassword: z
      .string()
      .min(8, "A senha deve conter pelo menos 8 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"], // <- onde o erro vai aparecer
  });

type FormSchema = z.infer<typeof formSchema>;

const SignUpForm = () =>  {
    // 1. Define your form.
    const form = useForm<FormSchema>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
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
              <CardTitle>Cadastrar</CardTitle>
              <CardDescription>
                Faça cadastro para continuar
              </CardDescription>
            </CardHeader>

            <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CardContent className="grid gap-6">
                    
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                    <Input placeholder="Digite seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
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
            <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                    <Input placeholder="Confirme sua senha" type="password"  {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
                    </CardContent>
                <CardFooter>
                <Button type="submit">Cadastrar</Button>
                </CardFooter>
            </form>
            </Form>
        </Card>

        
    </>  
  )
};


 
export default SignUpForm;