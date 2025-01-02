import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Topic } from "aws-cdk-lib/aws-sns";
import { EmailSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { SharedInfraStackProps } from "../interfaces/shared-infra-stack-props.interface";

export class PetsInfraStack extends cdk.Stack {
  public readonly petsTable: Table;

  constructor(scope: Construct, id: string, props: SharedInfraStackProps) {
    super(scope, id, props);

    const {
      resourcePrefix,
      environmentName,
      SNSEmailSubscription = "",
    } = props;
    const tableName = `${resourcePrefix}-table-${environmentName}`;
    const topicArn = `${resourcePrefix}-topic-arn-${environmentName}`;

    // Tabla de DynamoDB
    this.petsTable = new Table(
      this,
      `${resourcePrefix}-dynamo-table-${environmentName}`,
      {
        partitionKey: {
          name: "petId",
          type: AttributeType.STRING,
        },
        billingMode: BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        tableName,
      }
    );

    this.petsTable.addGlobalSecondaryIndex({
      indexName: "FoundationTypeIndex",
      partitionKey: { name: "foundationId", type: AttributeType.STRING },
      sortKey: { name: "type", type: AttributeType.STRING },
    });

    this.petsTable.addGlobalSecondaryIndex({
      indexName: "FoundationNameIndex",
      partitionKey: { name: "foundationId", type: AttributeType.STRING },
      sortKey: { name: "name", type: AttributeType.STRING },
    });

    this.petsTable.addGlobalSecondaryIndex({
      indexName: "FoundationBreedIndex",
      partitionKey: { name: "foundationId", type: AttributeType.STRING },
      sortKey: { name: "breed", type: AttributeType.STRING },
    });

    // SNS Topic para "pet-happy"
    const petHappyTopic = new Topic(
      this,
      `${resourcePrefix}-topic-${environmentName}`,
      {
        topicName: "pet-happy-training",
      }
    );

    // Agregar el email a notificar por el topico
    petHappyTopic.addSubscription(new EmailSubscription(SNSEmailSubscription));

    // Outputs
    new cdk.CfnOutput(this, tableName, {
      value: this.petsTable.tableName,
      description: "DynamoDB table for pets",
      exportName: tableName,
    });

    new cdk.CfnOutput(this, topicArn, {
      value: petHappyTopic.topicArn,
      description: "SNS 'pet-happy' topic ARN",
      exportName: topicArn,
    });
  }
}
