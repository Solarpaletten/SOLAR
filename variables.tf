variable "do_token" {
  type        = string
  description = "DigitalOcean API token"
  sensitive   = true
}

variable "ssh_key_id" {
  type        = string
  description = "DigitalOcean SSH Key ID"
}