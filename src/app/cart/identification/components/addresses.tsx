"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { shippingAddressTable } from "@/db/schema";

import { formatAddress } from "../../helpers/address";
import { useCreateShippingAddress } from "@/action/hooks/mutation/use-create-shipping-address";
import { useUpdateCartShippingAddress } from "@/action/hooks/mutation/use-update-cart-shipping-address";
import { useUserAddresses } from "@/action/hooks/queries/use-user-addresses";
import { CreateShippingAddressSchema } from "@/action/create-shipping-address/schema";

const formSchema = z.object({
  email: z.string().email(),
  recipientName: z.string().min(1),
  nif: z.string().min(9),
  telemovel: z.string().min(16),
  codigoPostal: z.string().min(4),
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  provincia: z.string().min(1),
  city: z.string().min(1),
  country: z.literal("Portugal"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddressesProps {
  shippingAddresses: (typeof shippingAddressTable.$inferSelect)[];
  defaultShippingAddressId: string | null;
}

const Addresses = ({
  shippingAddresses,
  defaultShippingAddressId,
}: AddressesProps) => {
  const router = useRouter();
  const createShippingAddressMutation = useCreateShippingAddress();
  const updateCartShippingAddressMutation = useUpdateCartShippingAddress();
  const { data: addresses, isLoading } = useUserAddresses({
    initialData: shippingAddresses,
  });

  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    defaultShippingAddressId || null,
  );
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    if (!addresses || addresses.length === 0) {
      setShowForm(true);
      setSelectedAddress("add_new");
    }
  }, [addresses]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      recipientName: "",
      nif: "",
      telemovel: "",
      codigoPostal: "",
      street: "",
      number: "",
      complement: "",
      provincia: "",
      city: "",
      country: "Portugal",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const payload: CreateShippingAddressSchema = {
        ...values,
        complement: values.complement ?? undefined,
        country: "Portugal",
      };
      const newAddress =
        await createShippingAddressMutation.mutateAsync(payload);

      toast.success("Morada criada com sucesso!");
      form.reset();
      setSelectedAddress(newAddress.id);
      setShowForm(false);

      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: newAddress.id,
      });
      toast.success("Morada vinculada ao carrinho!");
    } catch (error) {
      toast.error("Erro ao criar morada. Tente novamente.");
      console.error(error);
    }
  };

  const handleGoToPayment = async () => {
    if (!selectedAddress || selectedAddress === "add_new") return;
    try {
      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: selectedAddress,
      });
      toast.success("Morada selecionada para entrega!");
      router.push("/cart/confirmation");
    } catch (error) {
      toast.error("Erro ao selecionar morada. Tente novamente.");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedAddress(null);
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center">
            <p>Carregando moradas...</p>
          </div>
        ) : (
          <>
            {!showForm && (
              <RadioGroup
                value={selectedAddress}
                onValueChange={(value) => {
                  setSelectedAddress(value);
                  setShowForm(value === "add_new");
                }}
              >
                {addresses?.map((address) => (
                  <Card key={address.id} className="mb-2">
                    <CardContent className="flex items-start space-x-2">
                      <RadioGroupItem value={address.id} id={address.id} />
                      <Label
                        htmlFor={address.id}
                        className="flex-1 cursor-pointer"
                      >
                        {formatAddress(address)}
                      </Label>
                    </CardContent>
                  </Card>
                ))}

                <Card className="mt-2">
                  <CardContent className="flex items-center space-x-2">
                    <RadioGroupItem value="add_new" id="add_new" />
                    <Label htmlFor="add_new">Adicionar nova morada</Label>
                  </CardContent>
                </Card>
              </RadioGroup>
            )}

            {selectedAddress && selectedAddress !== "add_new" && (
              <div className="mt-4">
                <Button
                  onClick={handleGoToPayment}
                  className="w-full"
                  disabled={updateCartShippingAddressMutation.isPending}
                >
                  {updateCartShippingAddressMutation.isPending
                    ? "Processando..."
                    : "Ir para pagamento"}
                </Button>
              </div>
            )}

            {showForm && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mt-4 space-y-4"
                >
                  <div className="grid gap-4 md:grid-cols-2">
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
                      name="recipientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite seu nome completo"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nif"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIF</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite seu NIF" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="telemovel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telemóvel</FormLabel>
                          <FormControl>
                            <PatternFormat
                              format="(###) #####-####"
                              placeholder="(351) 99999-9999"
                              customInput={Input}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="codigoPostal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código Postal</FormLabel>
                          <FormControl>
                            <Input placeholder="0000-000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite seu endereço"
                              {...field}
                            />
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
                          <FormLabel>Número</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o número" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="complement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complemento</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Apto, bloco, etc. (opcional)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="provincia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Província</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite a província"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite a cidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={() => (
                        <FormItem>
                          <FormLabel>País</FormLabel>
                          <FormControl>
                            <Input value="Portugal" readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={
                      createShippingAddressMutation.isPending ||
                      updateCartShippingAddressMutation.isPending
                    }
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      createShippingAddressMutation.isPending ||
                      updateCartShippingAddressMutation.isPending
                    }
                  >
                    {createShippingAddressMutation.isPending ||
                    updateCartShippingAddressMutation.isPending
                      ? "Salvando..."
                      : "Salvar morada"}
                  </Button>
                </form>
              </Form>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Addresses;
