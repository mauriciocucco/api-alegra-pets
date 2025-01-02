import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { SharedInfraStackProps } from "../interfaces/shared-infra-stack-props.interface";

export class SharedInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SharedInfraStackProps) {
    super(scope, id, props);

    const { resourcePrefix, environmentName } = props;
    const bucketName = `${resourcePrefix}-shared-bucket-name-${environmentName}`;

    // Bucket de s3 para almacenar requests
    const requestBucket = new Bucket(
      this,
      `${resourcePrefix}-shared-bucket-${environmentName}`,
      {
        versioned: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      }
    );

    // Output
    new cdk.CfnOutput(this, bucketName, {
      value: requestBucket.bucketName,
      description: "Bucket where requests are stored",
      exportName: bucketName,
    });
  }
}
