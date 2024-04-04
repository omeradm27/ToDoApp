import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    //.oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const yupSync = {
  async validator({ field }, value) {
    await validationSchema.validateSyncAt(field, { [field]: value });
  },
};

export default function Register() {
  const [form] = Form.useForm();
  const [apiError, setApiError] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setApiError({});

    try {
      const response = await AuthService.registerAdmin(data);
      if(response.success ) {
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setApiError(error.response.data);
      } else {
        setApiError({ general: 'An error occurred. Please try again later.' });
      }
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[yupSync]}
            validateStatus={apiError.username ? 'error' : ''}
            help={apiError.username}
          >
            <Input placeholder="Please input your username" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[yupSync]}
            validateStatus={apiError.password ? 'error' : ''}
            help={apiError.password}
          >
            <Input.Password placeholder="Please input your password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[yupSync]}
            validateStatus={apiError.confirmPassword ? 'error' : ''}
            help={apiError.confirmPassword}
          >
            <Input.Password placeholder="Please input your password again" />
          </Form.Item>
          {apiError.general && <p style={{ color: 'red' }}>{apiError.general}</p>}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Register</Button>
          </Form.Item>
          <div style={{ color: 'gray' }}>
            <p>Do you have an account? <a href="/" style={{ color: 'blue' }}>Login</a></p>
          </div>
        </Form>
      </Card>
    </div>
  );
}
