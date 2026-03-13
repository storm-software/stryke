{ pkgs, inputs, ... }:
{
  name = "storm-software/stryke";

  dotenv.enable = true;
  dotenv.filename = [
    ".env"
    ".env.local"
  ];
  dotenv.disableHint = true;

  packages = [
    pkgs.capnproto
  ];
}
