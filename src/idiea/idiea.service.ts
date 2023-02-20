import { Injectable } from '@nestjs/common';
import { Idiea } from '@prisma/client';
import { Exception } from 'handlebars';
import { PrismaService } from 'prisma/prisma.service';
import { CreateIdieaDto } from './dto/create-idiea.dto';

@Injectable()
export class IdieaService {
  constructor(private prisma: PrismaService) {}

  async createNewIdiea(
    createIdieaDto: CreateIdieaDto,
    userId: number,
  ): Promise<Idiea> {
    const { idCategory, ...inputCreateIdiea } = createIdieaDto;

    const newIdiea = await this.prisma.idiea.create({
      data: {
        ...inputCreateIdiea,
        anonymous: Boolean(createIdieaDto.anonymous),
        userId: userId,
      },
    });

    idCategory.forEach(async (id) => {
      await this.prisma.idiea.update({
        where: {
          id: newIdiea.id,
        },
        data: {
          categories: {
            connect: {
              id: Number(id),
            },
          },
        },
      });
    });

    return newIdiea;
  }

  findAll() {
    try {
      return this.prisma.idiea.findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          categories: {
            select: {
              categoryName: true,
            },
          },
          comments: {
            select: {
              id: true,
            },
          },
          likes: {
            select: {
              positive: true,
            },
          },
        },
      });
    } catch (e) {
      throw new Exception('Cant not get');
    }
  }
}
