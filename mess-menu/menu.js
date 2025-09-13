const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

function parseMenu() {
  try {
    // Read the Excel file
    const filePath = path.join(__dirname, "mess.xlsx");

    if (!fs.existsSync(filePath)) {
      console.error(
        "Error: mess.xlsx file not found in the current directory."
      );
      return;
    }

    const workbook = xlsx.readFile(filePath);

    // Use the first sheet if no menu sheet is found
    const sheetName =
      workbook.SheetNames.find((s) => s.toLowerCase().includes("menu")) ||
      workbook.SheetNames[0];

    if (!sheetName) {
      console.error("Error: No sheets found in the Excel file.");
      return;
    }

    console.log(`Processing sheet: ${sheetName}`);

    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, {
      header: 1,
      blankrows: false,
    });

    // Find the header row containing days of the week
    const headerRowIndex = data.findIndex(
      (row) =>
        Array.isArray(row) &&
        row.some(
          (cell) => cell && cell.toString().trim().toUpperCase() === "MONDAY"
        )
    );

    if (headerRowIndex === -1) {
      console.error(
        "Error: Could not find the header row with 'MONDAY' in the sheet."
      );
      return;
    }

    // Extract days from the header row (skip the first empty column)
    const headerRow = data[headerRowIndex];
    const days = [];

    for (let i = 1; i < headerRow.length; i++) {
      const day = headerRow[i];
      if (day && day.toString().trim()) {
        const dayUpper = day.toString().trim().toUpperCase();
        // Only include valid days of the week
        if (
          [
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
            "SUNDAY",
          ].includes(dayUpper)
        ) {
          days.push(dayUpper);
        }
      }
    }

    // Initialize the menu structure
    let menu = {};
    days.forEach((day) => {
      menu[day] = {
        breakfast: [],
        lunch: [],
        snacks: [],
        dinner: [],
      };
    });

    let currentMeal = null;
    const mealNames = ["BREAKFAST", "LUNCH", "SNACKS", "DINNER"];

    // Function to check if a value is junk
    function isJunk(text) {
      if (!text) return true;

      const textStr = text.toString().trim();
      if (textStr === "") return true;

      const textLower = textStr.toLowerCase();

      // Filter out junk keywords
      const junkWords = [
        "suggestion",
        "feedback",
        "contact",
        "bchfood",
        "hi-tea",
        "timing",
        "sunday",
      ];

      if (junkWords.some((word) => textLower.includes(word))) return true;

      // Filter out pure numbers
      if (/^\d+(\.\d+)?$/.test(textStr)) return true;

      // Filter out time formats (12:30PM, 12:30 PM, 12:30, etc.)
      if (/^\d{1,2}:\d{2}\s*(AM|PM|am|pm)?$/i.test(textStr)) return true;
      if (/^\d{1,2}:\d{2}\s*(AM|PM|am|pm)$/i.test(textStr)) return true;

      // Filter out time-related phrases
      if (/\b(am|pm)\b/i.test(textStr) && /\d/.test(textStr)) return true;

      // Filter out timing-related words
      const timeWords = [
        "timing",
        "time",
        "schedule",
        "duration",
        "minutes",
        "hours",
      ];
      if (timeWords.some((word) => textLower.includes(word))) return true;

      // Filter out very short strings that are likely not food items
      if (textStr.length < 2) return true;

      // Filter out strings that are mostly numbers with minimal text
      if (/^\d+[A-Za-z]{0,2}$/.test(textStr)) return true;

      return false;
    }

    // Function to check if a string is a valid food item from first column
    function isValidFirstColumnFoodItem(text) {
      if (isJunk(text)) return false;

      const textStr = text.toString().trim();
      if (textStr === "") return false;

      const textUpper = textStr.toUpperCase();

      // Don't treat meal names as food items
      if (mealNames.includes(textUpper)) return false;

      // Don't treat obvious non-food items as food
      const nonFoodPatterns = [
        /^[A-Z]{2,}\s*:/, // Pattern like "NOTE:", "TIME:", etc.
        /^\d+\.\d+$/, // Decimal numbers
        /^[A-Z\s]+\s*:$/, // All caps followed by colon
        /^TOTAL/i,
        /^SUBTOTAL/i,
        /^REMARKS/i,
        /^NOTES/i,
      ];

      if (nonFoodPatterns.some((pattern) => pattern.test(textStr)))
        return false;

      // Additional check: if it's too short or seems like a header/label
      if (textStr.length < 3) return false;

      // Check if it looks like a food item (contains common food words or patterns)
      const foodIndicators = [
        /\b(dal|rice|chapati|roti|sabji|curry|masala|fry|bhaji|pakora|chutney|raita|biryani|pulao)\b/i,
        /\b(idli|dosa|sambhar|vada|upma|poha|paratha|puri|bhatura)\b/i,
        /\b(paneer|aloo|gobi|palak|matar|baingan|bhindi|lauki|karela)\b/i,
        /\b(tea|coffee|juice|water|milk|curd|lassi)\b/i,
        /\b(laddu|halwa|kheer|gulab jamun|rasgulla|jalebi|barfi)\b/i,
      ];

      // If it matches food indicators, definitely a food item
      if (foodIndicators.some((pattern) => pattern.test(textStr))) return true;

      // If it doesn't match food indicators but passes other checks,
      // still consider it a food item (to catch items we didn't think of)
      return textStr.length >= 3 && !textStr.match(/^[A-Z\s]+$/);
    }

    // Process each row after the header
    for (let i = headerRowIndex + 1; i < data.length; i++) {
      const row = data[i];

      if (!Array.isArray(row) || row.length === 0) continue;

      const firstCell = (row[0] || "").toString().trim().toUpperCase();

      // Check if this row starts a new meal section
      if (mealNames.includes(firstCell)) {
        currentMeal = firstCell.toLowerCase();

        // Process day-specific items in the same row as the meal header
        for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
          const dayName = days[dayIndex];
          const cellIndex = dayIndex + 1; // +1 because first column is for meal names

          if (cellIndex < row.length && row[cellIndex]) {
            const daySpecificItem = row[cellIndex].toString().trim();
            if (
              !isJunk(daySpecificItem) &&
              !menu[dayName][currentMeal].includes(daySpecificItem)
            ) {
              menu[dayName][currentMeal].push(daySpecificItem);
            }
          }
        }
        continue;
      }

      // Process food items if we're in a meal section
      if (currentMeal) {
        const firstColumnItem = row[0] ? row[0].toString().trim() : "";

        // Check if first column has a valid food item (common to all days)
        if (isValidFirstColumnFoodItem(firstColumnItem)) {
          // Add this item to all days for the current meal
          for (const dayName of days) {
            if (!menu[dayName][currentMeal].includes(firstColumnItem)) {
              menu[dayName][currentMeal].push(firstColumnItem);
            }
          }
        }

        // Process day-specific items (regardless of whether first column has food item)
        for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
          const dayName = days[dayIndex];
          const cellIndex = dayIndex + 1; // +1 because first column is for meal names/common items

          if (cellIndex < row.length && row[cellIndex]) {
            const daySpecificItem = row[cellIndex].toString().trim();
            if (
              !isJunk(daySpecificItem) &&
              !menu[dayName][currentMeal].includes(daySpecificItem)
            ) {
              menu[dayName][currentMeal].push(daySpecificItem);
            }
          }
        }
      }
    }

    // Clean up and deduplicate arrays
    Object.keys(menu).forEach((day) => {
      Object.keys(menu[day]).forEach((meal) => {
        // Remove duplicates and empty strings
        menu[day][meal] = [...new Set(menu[day][meal])].filter(
          (item) => item && item.trim() !== ""
        );
      });
    });

    // Save the result
    const outPath = path.join(__dirname, "menu.json");
    fs.writeFileSync(outPath, JSON.stringify(menu, null, 2), "utf-8");

    console.log("Menu parsed successfully!");
    console.log(`Output saved to: ${outPath}`);

    // Display summary
    Object.keys(menu).forEach((day) =>
      console.log(
        `- \x1b[1m${day}:\x1b[0m breakfast(${menu[day].breakfast.length}) lunch(${menu[day].lunch.length}) snacks(${menu[day].snacks.length}) dinner(${menu[day].dinner.length})`
      )
    );
  } catch (error) {
    console.error("Error processing the Excel file:", error.message);
  }
}

// Run the parser
parseMenu();
