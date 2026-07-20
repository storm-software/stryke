{ pkgs, ... }:
{
  name = "storm-software/stryke";

  dotenv = {
    enable = true;
    filename = [
      ".env"
      ".env.local"
    ];
    disableHint = true;
  };

  packages = with pkgs; [
    capnproto
  ];
}
