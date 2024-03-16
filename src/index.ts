import express from 'express';
import { PrismaClient } from '@prisma/client';
import validate from './validator';

export const app = express();
export const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/users', async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    } else {
      return res.status(200).json(users);
    }
  } catch {
    res.status(500).json({ message: "Internal Server Error"});
  }
})

app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      return res.status(200).json(user);
    }
  } catch {
    res.status(500).json({ message: "Internal Server Error"});
  }
})

// TBA: check if email is already recorded.

app.post('/users', async (req, res) => {
  try {
    const { name, email, password, phone_number } = req.body;
    const validation = validate(name, email, password, phone_number);
    if (validation === true) {
      const user = await prisma.users.create({
        data: {
          name,
          email,
          password,
          phone_number,
        }
      });
      return res.status(201).json(user);
    } else {
      return res.status(400).json({ message: validation });
    }
  } catch {
    res.status(500).json({ message: "Internal Server Error"});
  }
})

app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phone_number } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const validation = validate(name, email, password, phone_number);
    if (validation) {
      const user = await prisma.users.update({
        where: { id },
        data: {
          name,
          email,
          password,
          phone_number
        }
      });
      return res.status(200).json(user);
    } else {
      return res.status(400).json({ message: validation });
    }
  } catch {
    res.status(500).json({ message: "Internal Server Error"});
  }
})

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    } else {
      const user = await prisma.users.delete({
        where: { id }
      });
      return res.status(200).json(user);
    }
  } catch {
    res.status(500).json({ message: "Internal Server Error"});
  }
})

let server: any;
export async function serverStart() {
  server = app.listen(3000, () => {
    console.log('Server is running on localhost:3000');
  });
}

export async function serverStop() {
  if (server) {
    server.close()
  }
}
