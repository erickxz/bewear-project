"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-shipping-address";

const addressSchema = z.object({    
    email: z.string().email("Email inválido"),
    fullName: z.string().min(1, "Nome completo é obrigatório").min(2, "Nome deve ter pelo menos 2 caracteres"),
    document: z.string().min(1, "Documento é obrigatório").refine((val) => { const clean = val.replace(/\D/g, ""); return clean.length === 11 || clean.length === 14; }, { message: "Documento deve ter 11 (CPF) ou 14 dígitos (CNPJ)" }),
    phone: z.string().min(1, "Celular é obrigatório").refine((val) => val.replace(/\D/g, "").length === 11, { message: "Celular deve ter 11 dígitos" }),
    zipCode: z.string().min(1, "CEP é obrigatório").refine((val) => val.replace(/\D/g, "").length === 8, { message: "CEP deve ter 8 dígitos" }),
    address: z.string().min(1, "Endereço é obrigatório").min(5, "Endereço deve ter pelo menos 5 caracteres"),
    number: z.string().min(1, "Número é obrigatório").regex(/^\d+$/, "Número deve conter apenas dígitos"),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, "Bairro é obrigatório").min(2, "Bairro deve ter pelo menos 2 caracteres"),
    city: z.string().min(1, "Cidade é obrigatória").min(2, "Cidade deve ter pelo menos 2 caracteres"),
    state: z.string().min(1, "Estado é obrigatório").max(2, "Estado deve ter no máximo 2 caracteres (UF)"),
  });

type AddressFormData = z.infer<typeof addressSchema>;

const Addresses = () => {
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [documentType, setDocumentType] = useState<'cpf' | 'cnpj'>('cpf');
    
    const createShippingAddressMutation = useCreateShippingAddress();
    
    const form = useForm<AddressFormData>({
      resolver: zodResolver(addressSchema),
      defaultValues: {
        email: "",
        fullName: "",
        document: "",
        phone: "",
        zipCode: "",
        address: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: ""
      }
    });

    const onSubmit = async (values: AddressFormData) => {
      try {
        await createShippingAddressMutation.mutateAsync(values);
        toast.success("Endereço salvo com sucesso!");
        setSelectedAddress(null);
        form.reset();
      } catch (error) {
        toast.error("Erro ao salvar endereço. Tente novamente.");
        console.error("Erro ao salvar endereço:", error);
      }
    };
  return (
    <Card>
        <CardHeader>
            <CardTitle>Identificação</CardTitle>
        </CardHeader>
        <CardContent>
            <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
            <Card>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="add_new" id="add_new" />
                        <Label htmlFor="option-two">Adicionar novo endereço</Label>
                    </div>
                </CardContent>
            </Card>
            </RadioGroup>
            {selectedAddress === "add_new" && (
            //   @ts-expect-error - Type issue with Form component
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Digite seu email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo *</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite seu nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Documento *</Label>
                    <RadioGroup value={documentType} onValueChange={(value) => setDocumentType(value as 'cpf' | 'cnpj')} className="grid-cols-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cpf" id="cpf" />
                        <Label htmlFor="cpf">CPF</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cnpj" id="cnpj" />
                        <Label htmlFor="cnpj">CNPJ</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{documentType.toUpperCase()} *</FormLabel>
                        <FormControl>
                          <PatternFormat
                            format={documentType === 'cpf' ? '###.###.###-##' : '##.###.###/####-##'}
                            mask="_"
                            customInput={Input}
                            placeholder={`Digite seu ${documentType.toUpperCase()}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Celular *</FormLabel>
                        <FormControl>
                          <PatternFormat
                            format="(##) #####-####"
                            mask="_"
                            customInput={Input}
                            placeholder="Digite seu celular"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP *</FormLabel>
                        <FormControl>
                          <PatternFormat
                            format="#####-###"
                            mask="_"
                            customInput={Input}
                            placeholder="Digite seu CEP"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Endereço *</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite seu endereço" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número *</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o número" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="complement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o complemento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro *</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o bairro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade *</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite a cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado *</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o estado (UF)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto"
                    disabled={createShippingAddressMutation.isPending}
                  >
                    {createShippingAddressMutation.isPending ? "Salvando..." : "Salvar Endereço"}
                  </Button>
                </div>
                </form>
              </Form>
            )}
        </CardContent>
    </Card>
  )
}

export default Addresses;