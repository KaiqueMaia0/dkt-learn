import { Forum, Person } from "@mui/icons-material";

// Inside your navigation menu items
<>
  <MenuItem component={Link} to="/community">
    <ListItemIcon>
      <Forum />
    </ListItemIcon>
    <ListItemText>Comunidade</ListItemText>
  </MenuItem>

  <MenuItem component={Link} to="/profile">
    <ListItemIcon>
      <Person />
    </ListItemIcon>
    <ListItemText>Meu Perfil</ListItemText>
  </MenuItem>
</>;
