terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_droplet" "solar_droplet" {
  image    = "ubuntu-22-04-x64"
  name     = "solar-server"
  region   = "fra1"
  size     = "s-1vcpu-1gb"
  ssh_keys = [var.ssh_key_id]
}
