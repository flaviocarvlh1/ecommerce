"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCartStore } from "@/action/hooks/use-cart-store";
import { migrateGuestCart } from "@/action/migrate-guest-cart/migrate-guest-cart";
const formSchema = z
  .object({
    nome: z.string("Nome inválido!").trim().min(2, "Nome é Obrigatório"),
    email: z.email("E-mail inválido!"),
    password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
    passwordConfirmation: z.string().min(8, "Confirmação obrigatória"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    error: "As senhas não coincidem",
    path: ["passwordConfirmation"],
  });

type FormValues = z.infer<typeof formSchema>;

const SignUpForm = () => {
  const router = useRouter();
  const guestItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const { data, error } = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.nome,
      fetchOptions: {
        onSuccess: async () => {
          if (guestItems.length > 0) {
            try {
              await migrateGuestCart(
                guestItems.map((item) => ({
                  productVariantId: item.productVariantId,
                  quantity: item.quantity,
                })),
              );

              clearCart();
              toast.success("Carrinho migrado com sucesso!");
            } catch (error) {
              console.error("Erro ao migrar carrinho:", error);
              toast.error("Erro ao migrar carrinho, mas cadastro realizado.");
            }
          }

          router.push("/");
        },
        onError: (error) => {
          if (error.error.code == "USER_ALREADY_EXISTS") {
            toast.error("E-mail, já cadastrado.");
            return form.setError("email", {
              message: "E-mail já cadastrado.",
            });
          }
          toast.error(error.error.message);
        },
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>Preencha os dados para se cadastrar.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="nome"
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
                    <Input
                      placeholder="Digite sua senha"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite sua senha novamente"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Criar Conta</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default SignUpForm;
