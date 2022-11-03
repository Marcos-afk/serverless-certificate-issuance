import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamoDbClient";

interface UsersCertificateProps {
  id: string;
  name: string;
  grade: string;
  created_at: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;

  const response = await document
    .query({
      TableName: "users_certifications",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: { ":id": id },
    })
    .promise();

  const userCertificate = response.Items[0] as UsersCertificateProps;

  if (userCertificate) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Certificado válido!",
        name: userCertificate.name,
        grade: userCertificate.grade,
        url: `https://userscertifications.s3.amazonaws.com/${id}.pdf`,
      }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Certificado inválido",
    }),
  };
};
