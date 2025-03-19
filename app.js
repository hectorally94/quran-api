const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors()); 
const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Quran API",
        version: "1.0.0",
        description: "API for accessing Quranic data",
        contact: {
          name: "baba MediaQuery",
          email: "hectorally94@gmail.com",
        },
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: "Local server",
        },
      ],
      components: {
        

        schemas: {

            SimplifiedSurah: { // Renamed to avoid confusion
                type: "object",
                properties: {
                  number: { type: "integer" },
                  name_simple: { type: "string" },
                  name_complex: { type: "string" },
                  name_arabic: { type: "string" },
                  englishNameTranslation: { type: "string" },
                  KirundiNameTranslation:{type:"string"},
                  revelationType: { type: "string" },
                  verses_count: { type: "integer" }
                }},

                  // Detailed Variation
        DetailedSurah: {
            type: "object",
            properties: {
              number: { type: "integer" },
              name_simple: { type: "string" },
              name_complex: { type: "string" },
              name_arabic: { type: "string" },
              englishNameTranslation: { type: "string" },
              revelationType: { type: "string" },
              verses_count: { type: "integer" },
              pages: { 
                type: "array",
                items: { type: "integer" }
              },
              audio_url: { type: "string" } // Example additional field
            }
          },
            FullSurah:{
                type: "object",
                properties: {
                    Surah: {
                        type: "object",
                        properties: {
                          number: { type: "integer" },
                          name_simple: { type: "string" },
                          name_complex: { type: "string" },
                          name_arabic: { type: "string" },
                          englishNameTranslation: { type: "string" },
                          KirundiNameTranslation:{type:"string"},
                          revelationType: { type: "string" },
                          verses_count: { type: "integer" },
                          bismillah_pre: { type: "boolean" },
                          revelation_order: { type: "integer" },
                          pages: { 
                            type: "array",
                            items: { type: "integer" }
                          },
                          ayahs: {
                            type: "array",
                            items: { 
                              $ref: "#/components/schemas/Ayah" 
                            }
                          }
                        }
                      },
                      Ayah: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          sura: { type: "string" },
                          aya: { type: "string" },
                          arabic_text: { type: "string" },
                          translation: { type: "string" },
                          teksLatin: { type: "string" },
                          audio: { type: "object" },
                          footnotes: { type: "string" },
                          juz_number: { type: "integer" },
                          verse_key: { type: "string" },
                          hizb_number: { type: "integer" },
                          rub_el_hizb_number: { type: "integer" },
                          ruku_number: { type: "integer" },
                          manzil_number: { type: "integer" },
                          sajdah_number: { type: "null" },
                          page_number: { type: "integer" }
                        }
                      }
                 }
              
            }   
         
        }
      }
    },
    apis: ["./routes/*.js"]
  };

const swaggerSpec = swaggerJsDoc(swaggerOptions);

 
  // Serve Swagger UI
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
// Import routes
const surahRoutes = require("./routes/surahRoutes");
const { type } = require("os");

// Use routes
app.use("/api/surahs", surahRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});