{ pkgs, inputs, ... }:
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
}
