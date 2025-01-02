import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { SharedInfraStackProps } from "../interfaces/shared-infra-stack-props.interface";

export class FoundationsInfraStack extends cdk.Stack {
  public readonly foundationsTable: Table;

  constructor(scope: Construct, id: string, props: SharedInfraStackProps) {
    super(scope, id, props);

    const { resourcePrefix, environmentName } = props;
    const tableName = `${resourcePrefix}-foundations-table-${environmentName}`;

    // Tabla de DynamoDB
    this.foundationsTable = new Table(
      this,
      `${resourcePrefix}-foundations-dynamo-table-${environmentName}`,
      {
        partitionKey: {
          name: "foundationId",
          type: AttributeType.STRING,
        },
        billingMode: BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        tableName,
      }
    );

    // Output
    new cdk.CfnOutput(this, tableName, {
      value: this.foundationsTable.tableName,
      description: "DynamoDB table for foundations",
      exportName: tableName,
    });
  }
}
