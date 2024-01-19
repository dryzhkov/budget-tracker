import fs from "fs";

import * as dotenv from "dotenv";
import invariant from "tiny-invariant";

dotenv.config();

invariant(
  process.env.FAUNADB_ACCESS_TOKEN,
  "FAUNADB_SERVER_SECRET must be set",
);

const faunaGraphQLEndpoint = "https://graphql.us.fauna.com/graphql";

interface Category {}
async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await fetch(faunaGraphQLEndpoint, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.FAUNADB_ACCESS_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
          query AllCategories {
            allCategories {
              data {
                _id
                externalUrl
                _ts
                type
                title
                archived
                paymentFrequency
              }
            }
          }`,
      }),
    });

    const result = await response.json();
    if (result.errors) {
      console.error(result.errors);
      throw new Error(result.errors[0]);
    } else {
      return result.data.allCategories.data.map((item: any) => item);
    }
  } catch (error) {
    console.error("Error querying user data:", error);
    throw error;
  }
}

interface Statement {
  id: string;
  date: string;
  year: number;
}
async function getStatements(year: string): Promise<Statement[]> {
  try {
    const response = await fetch(faunaGraphQLEndpoint, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.FAUNADB_ACCESS_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
          query AllStatements($year: String!) {
            statementsByYear(year: $year) {
                data {
                    _id
                    date
                    year
                    transactions {
                        data {
                            _id
                            amount
                            category {
                                _id
                                title
                                type
                                archived
                                paymentFrequency
                                externalUrl
                            }
                        }
                    }
                }
            }
        }`,
        variables: { year },
      }),
    });

    const result = await response.json();
    if (result.errors) {
      console.error(result.errors);
      throw new Error(result.errors[0]);
    } else {
      return result.data.statementsByYear.data.map((item: any) => item);
    }
  } catch (error) {
    console.error("Error querying user data:", error);
    throw error;
  }
}

async function run() {
  const categories = await getAllCategories();
  let fileName = "categories.json";
  console.log("Exporting all categories to ", fileName);

  function writeToJSON(filePath: string, data: any) {
    fs.writeFileSync(`backup/${filePath}`, JSON.stringify(data, null, 2), {
      encoding: "utf-8",
      flag: "w",
    });
  }

  writeToJSON(fileName, categories);
  ["2018", "2019", "2020", "2021", "2022", "2023", "2024"].forEach(
    async (year) => {
      const statements = await getStatements(year);
      fileName = `statements_${year}.json`;
      console.log("Exporting statements for year " + year + " to ", fileName);
      writeToJSON(fileName, statements);
    },
  );
}

void run();
