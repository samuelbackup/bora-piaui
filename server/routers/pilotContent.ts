import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getCityBySlug,
  getItineraryByCitySlug,
  getItineraryBySlug,
  getPlaceBySlugAndCity,
  listCities,
  listCityContent,
  listItineraries,
} from "../db";
import { publicProcedure, router } from "../_core/trpc";

const slugInput = z.object({ slug: z.string().trim().min(2).max(120) });
const citySlugInput = z.object({ citySlug: z.string().trim().min(2).max(120) });

export const citiesRouter = router({
  list: publicProcedure.query(() => listCities()),
  getBySlug: publicProcedure.input(slugInput).query(async ({ input }) => {
    const city = await getCityBySlug(input.slug);
    if (!city)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Cidade não encontrada.",
      });
    return city;
  }),
});

export const cityPlacesRouter = router({
  listByCity: publicProcedure
    .input(citySlugInput)
    .query(({ input }) => listCityContent(input.citySlug)),
  getByCityAndSlug: publicProcedure
    .input(
      z.object({
        citySlug: citySlugInput.shape.citySlug,
        itemSlug: slugInput.shape.slug,
      })
    )
    .query(async ({ input }) => {
      const result = await getPlaceBySlugAndCity(
        input.citySlug,
        input.itemSlug
      );
      if (!result)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Local não encontrado.",
        });
      return result;
    }),
});

export const itinerariesRouter = router({
  list: publicProcedure.query(() => listItineraries()),
  getByCity: publicProcedure.input(citySlugInput).query(async ({ input }) => {
    return getItineraryByCitySlug(input.citySlug);
  }),
  getBySlug: publicProcedure.input(slugInput).query(async ({ input }) => {
    const result = await getItineraryBySlug(input.slug);
    if (!result)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Roteiro não encontrado.",
      });
    return result;
  }),
});
