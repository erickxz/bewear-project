"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { getCart } from "@/actions/get-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { shippingAddressTable } from "@/db/schema";
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-shipping-address";
import { useLinkShippingAddressToCart } from "@/hooks/mutations/use-link-shipping-address-to-cart";
import { useCart } from "@/hooks/queries/use-cart";
import { useShippingAddresses } from "@/hooks/queries/use-shipping-addresses";

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

interface AddressesProps {
    shippingAddresses: typeof shippingAddressTable.$inferSelect[];
    initialCart: Awaited<ReturnType<typeof getCart>>;
}

const Addresses = ({ shippingAddresses, initialCart }: AddressesProps) => {
    const [documentType, setDocumentType] = useState<'cpf' | 'cnpj'>('cpf');
    const router = useRouter();
    
    const createShippingAddressMutation = useCreateShippingAddress();
    const linkShippingAddressMutation = useLinkShippingAddressToCart();
    const { data: addresses, isLoading } = useShippingAddresses({initialData: shippingAddresses});
    
    const { data: cart } = useCart({initialData: initialCart});

    const [selectedAddress, setSelectedAddress] = useState<string | null>(
        cart?.shippingAddressId || initialCart.shippingAddressId || null
    );

    useEffect(() => {
        if (cart?.shippingAddressId && cart.shippingAddressId !== selectedAddress) {
            setSelectedAddress(cart.shippingAddressId);
        }
    }, [cart?.shippingAddressId, selectedAddress]);


    const formatAddress = (address: {
        recipientName: string;
        street: string;
        number: string;
        complement?: string | null;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    }) => {
        const addressLine = [address.street, address.number, address.complement]
            .filter(Boolean)
            .join(", ");
        
        const locationLine = `${address.neighborhood}, ${address.city}/${address.state}`;
        const zipLine = `CEP: ${address.zipCode}`;
        
        return {
            name: address.recipientName,
            address: addressLine,
            location: locationLine,
            zip: zipLine
        };
    };
    


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
        const newAddress = await createShippingAddressMutation.mutateAsync(values);
        toast.success("Endereço salvo com sucesso!");
        
        // Vincular o novo endereço ao carrinho
        const result = await linkShippingAddressMutation.mutateAsync(newAddress.id);
        if (result.success) {
          router.push("/cart/confirmation");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro ao salvar endereço. Tente novamente.";
        toast.error(errorMessage);
        console.error("Erro ao salvar endereço:", error);
      }
    };

    const handleExistingAddressSelection = async (addressId: string) => {
      try {
        const result = await linkShippingAddressMutation.mutateAsync(addressId);
        if (result.success) {
          router.push("/cart/confirmation");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro ao vincular endereço. Tente novamente.";
        toast.error(errorMessage);
        console.error("Erro ao vincular endereço:", error);
      }
    };
  return (
    <Card>
        <CardHeader>
            <CardTitle className="text-m font-bold">Identificação</CardTitle>
        </CardHeader>
        <CardContent>
            <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                  <div className="text-gray-600">Carregando endereços...</div>
                </div>
              ) : (
                <>
                  {addresses?.map((address) => {
                    const formatted = formatAddress(address);
                    return (
                      <Card key={address.id} className="cursor-pointer hover:bg-gray-50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor={address.id} className="cursor-pointer">
                                <div className="space-y-1">
                                  <div className="font-semibold text-gray-900">
                                    {formatted.name}
                                  </div>
                                  <div className="text-sm text-gray-700">
                                    {formatted.address}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {formatted.location}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatted.zip}
                                  </div>
                                </div>
                              </Label>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  <Card className="cursor-pointer hover:bg-gray-50 transition-colors border-dashed border-2 border-gray-300">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="add_new" id="add_new" />
                        <Label htmlFor="add_new" className="cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <div className="text-lg">+</div>
                            <div className="font-medium text-gray-700">Adicionar novo endereço</div>
                          </div>
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </RadioGroup>
            
            {selectedAddress !== "add_new" && (
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={() => selectedAddress && handleExistingAddressSelection(selectedAddress)}
                  disabled={!selectedAddress || linkShippingAddressMutation.isPending}
                  className="w-full md:w-auto rounded-full"
                >
                  {linkShippingAddressMutation.isPending ? "Vinculando..." : "Ir para Pagamento"}
                </Button>
              </div>
            )}
            
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

                <div className="flex justify-end    ">
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