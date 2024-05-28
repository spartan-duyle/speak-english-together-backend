import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.serivce';
import { Prisma } from '@prisma/client';

@Injectable()
export class CollectionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async insert(data: any, userId: number) {
    return this.prismaService.collection.create({
      data: {
        name: data.name,
        description: data.description,
        image_url: data.image_url,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findByNameAndUserId(name: string, userId: number) {
    return this.prismaService.collection.findFirst({
      where: {
        name,
        user_id: userId,
        deleted_at: null,
      },
    });
  }

  async getCollections(
    userId: number,
    page: number,
    perPage: number,
    search: string,
  ) {
    const whereCondition: Prisma.CollectionWhereInput = {
      user_id: userId,
      AND: [
        {
          OR: [
            {
              name: {
                contains: search,
              },
            },
          ],
          deleted_at: null,
        },
      ],
    };

    const data = await this.prismaService.collection.findMany({
      where: whereCondition,
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const total = await this.prismaService.collection.count({
      where: whereCondition,
    });

    return { data, total };
  }

  async findByIdAndUserId(collectionId: number, userId: number) {
    return this.prismaService.collection.findFirst({
      where: {
        id: collectionId,
        user_id: userId,
        deleted_at: null,
      },
    });
  }

  async update(data: any, collectionId: number) {
    return this.prismaService.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        name: data.name,
        description: data.description,
        image_url: data.image_url,
        updated_at: new Date(),
      },
    });
  }

  async delete(collectionId: number) {
    return this.prismaService.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
