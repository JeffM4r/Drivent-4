import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createBookingWithRoomId(roomId:number, userId:number) {
    return await prisma.booking.create({
        data: {
          roomId: roomId,
          userId: userId,
        }
      });
}