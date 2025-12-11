import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUsersResource } from '@/hooks/api/useUsersResource';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
  role: z.enum(['admin', 'funcionario']),
  position: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const usersResource = useUsersResource();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'funcionario',
    },
  });

  useEffect(() => {
    if (id) {
      // Carregar dados do usuário se estiver editando
      usersResource.findById(id).then((user) => {
        setValue('name', user.name);
        setValue('email', user.email);
        // Garante que o role seja mapeado corretamente (backend usa 'funcionario', frontend também)
        setValue('role', user.role === 'employee' ? 'funcionario' : user.role);
        // position não existe no backend, mas mantemos o campo no formulário para uso futuro
        setValue('position', '');
      });
    }
  }, [id, setValue, usersResource]);

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await usersResource.update({ id, ...data });
      } else {
        if (!data.password) {
          setError('Senha é obrigatória para novos usuários');
          setLoading(false);
          return;
        }
        await usersResource.create(data);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Editar Funcionário' : 'Cadastrar Funcionário'}</CardTitle>
          <CardDescription>
            {id
              ? 'Atualize as informações do funcionário'
              : 'Preencha os dados para cadastrar um novo funcionário'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{id ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Tipo de Usuário *</Label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('role')}
              >
                <option value="funcionario">Funcionário</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Cargo ou Função (opcional)</Label>
              <Input id="position" {...register('position')} />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

