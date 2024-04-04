import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd'; // Import Card component from Ant Design
import * as yup from 'yup';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
  username: yup.string().required('Username is Required'),
  password: yup.string().required('Password is required'),
});

const yupSync = {
  async validator({ field }, value) {
    await validationSchema.validateSyncAt(field, { [field]: value });
  },
};

export default function Login() {
  const [form] = Form.useForm();
  const [apiError, setApiError] = useState({});
  const navigate = useNavigate();
  const handleSubmit = async (data) => {
    setApiError({});
    try {
      const response = await AuthService.loginAdmin(data);
      if(response.success ) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/dashboard');
      }
    } catch (error) {
      setApiError(error.response.data);
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
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Login</Button>
          </Form.Item>
          <div style={{ color: 'gray' }}>
            <p>Don't have an account? <a href="/register" style={{ color: 'blue' }}>Register</a></p>
          </div>
        </Form>
      </Card>
    </div>
  );
}
