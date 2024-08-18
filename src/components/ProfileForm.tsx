'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  username: z.string()
    .min(2, {
      message: "ユーザー名は２文字以上です。",
    })
    .max(50, {
      message: "ユーザー名は50文字以内です。",
    }),
  picture: z.custom<FileList>()
    .refine((file) => file && file.length !== 0, {
      message: 'ファイルが選択されていません。',
    })
    .transform((file) => file[0]),
});

const ProfileForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('picture', values.picture);

    const response = await fetch('/api/profile', {
      method: 'post',
      body: formData,
    });

    console.log(await response.json());
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ユーザー名</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                一般公開されるあなたの名前です。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="picture"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>プロフィール画像</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  {...fieldProps} 
                  accept="image/*"
                  onChange={(event) => {
                    onChange(event.target.files && event.target.files);
                  }}
                />
              </FormControl>
              <FormDescription>
                あなたのプロフィール画像を選択してください。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">shadcnフォーム送信</Button>
      </form>
    </Form>
  );
};

export default ProfileForm;