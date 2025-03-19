const express = require("express");
const router = express.Router();
const quranData = require("../RamadhaniAllyContributionV6_audio_KirundiNameTranslation.json");

/**
 * @swagger
 * /api/surahs:
 *   get:
 *     summary: Get list of all Surahs
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     surahs:
 *                       type: array
 *                       items:
 *                         $ref: "#/components/schemas/SimplifiedSurah"
 */
router.get("/", (req, res) => {
  const surahs = quranData.data.surahs.map((surah) => ({
    number: surah.number,
    name_simple: surah.name_simple,
    name_complex: surah.name_complex,
    name_arabic: surah.name_arabic,
    englishNameTranslation: surah.englishNameTranslation,
    KirundiNameTranslation:surah.KirundiNameTranslation,
    revelationType: surah.revelationType,
    verses_count: surah.verses_count,
  }));
 
  res.json(surahs);
});

/**
 * @swagger
 * /api/surahs/search:
 *   get:
 *     summary: Search Surahs by name (simple, complex, Arabic)
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: The search query to filter Surahs by name.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/SimplifiedSurah"
 *       400:
 *         description: Bad request, search query is required.
 */
router.get("/search", (req, res) => {

  const searchQuery = req.query.query?.toLowerCase();
  if (!searchQuery) {
    return res.status(400).json({ error: "Search query is required" });
  }

  const filteredSurahs = quranData.data.surahs.filter((surah) =>
    surah.name_simple.toLowerCase().includes(searchQuery) ||
    surah.name_complex.toLowerCase().includes(searchQuery) ||
    surah.name_arabic.includes(searchQuery)
  )
  .map((surah) => ({
    number: surah.number,
    name_simple: surah.name_simple,
    name_complex: surah.name_complex,
    name_arabic: surah.name_arabic,
    englishNameTranslation: surah.englishNameTranslation,
    revelationType: surah.revelationType,
    verses_count: surah.verses_count,
  }));

  res.json(filteredSurahs);
});

/**
 * @swagger
 * /api/surahs/{surahNumber}:
 *   get:
 *     summary: Get a surah by number
 *     description: Retrieve a specific surah by its number.
 *     parameters:
 *       - in: path
 *         name: surahNumber
 *         required: true
 *         description: The number of the surah to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A surah object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FullSurah'
 *       404:
 *         description: Surah not found.
 */
router.get("/:surahNumber", (req, res) => {
  const surahNumber = parseInt(req.params.surahNumber);
  const surah = quranData.data.surahs.find((s) => s.number === surahNumber);

  if (surah) {
    res.json(surah);
  } else {
    res.status(404).json({ error: "Surah not found" });
  }
});

module.exports = router;


// docker build -t quran-api .
// docker run -d -p 5000:5000 --name quran-api-container quran-api
