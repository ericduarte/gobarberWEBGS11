import React, { useCallback, useRef, ChangeEvent } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

import Button from '../../components/Button';
import Input from '../../components/Input';

import { Container, Content, AvatarInput } from './styles';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

import profileDefaultImg from '../../assets/default-profile.png';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, updateUser } = useAuth();

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        api.patch('/users/avatar', data).then(response => {
          updateUser(response.data);
          addToast({
            type: 'success',
            title: 'Avatar atualizado',
          });
        });
      }
    },
    [addToast, updateUser],
  );

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome Obrigatório'),
          email: Yup.string()
            .email('Digite um email válido')
            .required('Email Obrigatório'),
          old_password: Yup.string().when('password', {
            is: val => !!val.length,
            then: Yup.string().required('Obrigatório ao informar a nova senha'),
            otherwise: Yup.string(),
          }),
          password: Yup.string().test(
            'len',
            'Senha maior que 6 caracteres',
            val => (val ? val.length >= 6 : true),
          ),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), undefined],
            'Confirme a nova senha',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        await api.put('/profile', formData);

        addToast({
          type: 'success',
          title: 'Cadastro realizado',
          description: 'Você já pode fazer seu logon no goBarber',
        });
        history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(error));
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro ao cadastrar perfil',
          description:
            'Ocorreu um erro ao tentar cadastrar seu perfil, tente novamente',
        });
      }
    },
    [history, addToast],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          initialData={{
            name: user.name,
            email: user.email,
          }}
        >
          <AvatarInput>
            <img src={user.avatar_url || profileDefaultImg} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input
                type="file"
                name=""
                id="avatar"
                onChange={handleAvatarChange}
              />
            </label>
          </AvatarInput>
          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova Senha"
          />
          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmar senha"
          />
          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
