import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { SharedInfraStackProps } from "../interfaces/shared-infra-stack-props.interface";

export class UsersInfraStack extends cdk.Stack {
  public readonly usersTable: Table;

  constructor(scope: Construct, id: string, props: SharedInfraStackProps) {
    super(scope, id, props);

    const { resourcePrefix, environmentName } = props;
    const tableName = `${resourcePrefix}-users-table-${environmentName}`;

    // Tabla de DynamoDB
    this.usersTable = new Table(
      this,
      `${resourcePrefix}-users-dynamo-table-${environmentName}`,
      {
        partitionKey: {
          name: "userId",
          type: AttributeType.STRING,
        },
        billingMode: BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        tableName,
      }
    );

    this.usersTable.addGlobalSecondaryIndex({
      indexName: "FoundationIndex",
      partitionKey: { name: "foundationId", type: AttributeType.STRING },
      sortKey: { name: "userId", type: AttributeType.STRING },
    });

    // Output
    new cdk.CfnOutput(this, tableName, {
      value: this.usersTable.tableName,
      description: "DynamoDB table for users",
      exportName: tableName,
    });
  }
}
