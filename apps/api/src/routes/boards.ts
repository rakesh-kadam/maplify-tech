import { Router, type Router as RouterType } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

export const boardsRouter: RouterType = Router();

// All routes require authentication
boardsRouter.use(authenticate);

const createBoardSchema = z.object({
  name: z.string().min(1).max(255),
  data: z.object({
    elements: z.array(z.any()),
    appState: z.record(z.any()),
    files: z.record(z.any()).optional(),
  }),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const updateBoardSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  data: z.object({
    elements: z.array(z.any()),
    appState: z.record(z.any()),
    files: z.record(z.any()).optional(),
  }).optional(),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Get all boards for current user
boardsRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const boards = await prisma.board.findMany({
      where: { userId: req.user!.userId },
      select: {
        id: true,
        name: true,
        thumbnail: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ boards });
  } catch (error) {
    next(error);
  }
});

// Get single board
boardsRouter.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const board = await prisma.board.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
    });

    if (!board) {
      res.status(404).json({ error: 'Board not found' });
      return;
    }

    res.json({ board });
  } catch (error) {
    next(error);
  }
});

// Create board
boardsRouter.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { name, data, thumbnail, tags } = createBoardSchema.parse(req.body);

    const board = await prisma.board.create({
      data: {
        name,
        data,
        thumbnail,
        tags: tags || [],
        userId: req.user!.userId,
      },
    });

    res.status(201).json({ board });
  } catch (error) {
    next(error);
  }
});

// Update board
boardsRouter.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { name, data, thumbnail, tags } = updateBoardSchema.parse(req.body);

    // Check ownership
    const existingBoard = await prisma.board.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
    });

    if (!existingBoard) {
      res.status(404).json({ error: 'Board not found' });
      return;
    }

    const board = await prisma.board.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(data && { data }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(tags && { tags }),
      },
    });

    res.json({ board });
  } catch (error) {
    next(error);
  }
});

// Delete board
boardsRouter.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    // Check ownership
    const board = await prisma.board.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
    });

    if (!board) {
      res.status(404).json({ error: 'Board not found' });
      return;
    }

    await prisma.board.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Duplicate board
boardsRouter.post('/:id/duplicate', async (req: AuthRequest, res, next) => {
  try {
    const originalBoard = await prisma.board.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
    });

    if (!originalBoard) {
      res.status(404).json({ error: 'Board not found' });
      return;
    }

    const duplicatedBoard = await prisma.board.create({
      data: {
        name: `${originalBoard.name} (Copy)`,
        data: originalBoard.data as any,
        thumbnail: originalBoard.thumbnail,
        tags: originalBoard.tags,
        userId: req.user!.userId,
      },
    });

    res.status(201).json({ board: duplicatedBoard });
  } catch (error) {
    next(error);
  }
});
