terraform {
  required_providers {
    null = {
      source  = "hashicorp/null"
      version = "3.2.1"
    }
  }
}

provider "null" {}

resource "null_resource" "hello" {
  provisioner "local-exec" {
    command = "echo 'Привет от Terraform и SOLAR!'"
  }
}
