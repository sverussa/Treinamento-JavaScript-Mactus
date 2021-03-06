import React, { PureComponent } from 'react';

import { Button } from 'antd';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Form } from 'antd';

import "./LoginPage.css";
import InputForm from '../components/InputForm';
import { isLoggedIn, saveToken } from '../utils/LoginManager';
import { validateEmail, validateSenha, checkFormIsValid } from '../utils/Validator';

const FormItem = Form.Item;

export default class LoginPage extends PureComponent {

    state = { email: '', senha: '' };

    onFormSubmit = (event) => {
        event.preventDefault();

        if (checkFormIsValid(this.refs)) {
            this.postLogin();
        }
    }

    postLogin = () => {
        const { email, senha } = this.state;

        return axios.post("/usuarios/login", {
            email, senha
        }).then(response => {
            saveToken(response.data.token);
            this.props.history.push('/');
        }).catch(ex => {
            console.error(ex);
            const { response } = ex;
            if (response) {
                console.error('response', response)
                if (ex.response.status === 401) {
                    alert('Usuário ou senha incorretos.');
                } else if (ex.response.status === 422) {
                    alert('Não foi efetuar login, verifique os dados informados e tente novamente.');
                } else {
                    alert('Não foi efetuar login, tente novamente mais tarde.');
                }
            } else {
                alert('Não foi efetuar login, verifique sua conexão com a internet.');
            }
        })
    }

    onCadastrarClick = () => {
        this.props.history.push('/cadastro')
    }

    onInputChange = (event) => {
        const { id, value } = event.target;
        this.setState({ [id]: value });
    }

    render() {
        if (isLoggedIn()) {
            return <Redirect to="/" />
        }

        const { email, senha } = this.state;

        return (
            <Form onSubmit={this.onFormSubmit} className="login-page-form">
                <h3>Efetue login para iniciar.</h3>

                <InputForm label="E-mail" id="email" ref="email" type="email" value={email} onChange={this.onInputChange} required={true}
                    validator={validateEmail} errorMessage="Informe um e-mail válido." />

                <InputForm label="Senha" id="senha" ref="senha" value={senha} onChange={this.onInputChange} type="password" required={true}
                    validator={validateSenha} errorMessage="A senha deve conter no mínimo 6 e no máximo 8 caracteres." />

                <FormItem style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit" className="login-page-form-button">
                        Entrar
                        </Button>
                    Ou <a onClick={this.onCadastrarClick}>Cadastre-se agora!</a>
                </FormItem>
            </Form>
        )
    }
}
