import { NotFoundException } from '@nestjs/common';
import { Model, ModelStatic, WhereOptions } from 'sequelize';

export const isExistsById = async <T extends Model>(
  model: ModelStatic<T>,
  id: number,
): Promise<void> => {
  const count = await model.count({
    //q
    //что это? почему двойное приведение типов?
    where: { id } as unknown as WhereOptions<T['_attributes']>,
  });

  if (count === 0) {
    throw new NotFoundException(`${model.name} not found`);
  }
};
